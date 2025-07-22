import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import PieChart from '@/components/PieChart';

const LLM_BASE_URL = '';

const TestCase = () => {
    const [userStory, setUserStory] = useState('As a new customer, I want to be able to easily apply for a car insurance policy online by providing basic personal and vehicle details, so that I can receive a quote and start coverage quickly.');
    const [numTestCases, setNumTestCases] = useState(5);
    const [testCaseDetails, setTestCaseDetails] = useState('');
    const [urlTestCaseDetails, setUrlTestCaseDetails] = useState<any>(null);
    const [testUrl, setTestUrl] = useState('https://www.acko.com/car-insurance/');
    const [visualizationData, setVisualizationData] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const { toast } = useToast();

    const generateTestCases = async () => {
        if (!userStory.trim()) {
            toast({ title: 'Error', description: 'Please provide a user story to test', variant: 'destructive' });
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch(`${LLM_BASE_URL}/generate_test_cases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feature_description: userStory, num_test_cases: numTestCases })
            });
            if (!response.ok) throw new Error('Failed to generate test cases');
            const data = await response.json();
            setTestCaseDetails(data.data);
            toast({ title: 'Success', description: 'Test cases generated successfully' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to generate test cases', variant: 'destructive' });
        } finally {
            setIsGenerating(false);
        }
    };

    const executeTestCases = async () => {
        if (!testUrl.trim()) {
            toast({ title: 'Error', description: 'Please provide a test URL', variant: 'destructive' });
            return;
        }
        setIsExecuting(true);
        try {
            const response = await fetch(`${LLM_BASE_URL}/run_tests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: testUrl })
            });
            const data = await response.json();
            setUrlTestCaseDetails(data);
            if (!response.ok) throw new Error('Failed to execute test cases');
            toast({ title: 'Success', description: 'Test cases executed successfully' });
            loadVisualizationData();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to execute test cases', variant: 'destructive' });
        } finally {
            setIsExecuting(false);
        }
    };

    const loadVisualizationData = async () => {
        setIsLoadingResults(true);
        try {
            const response = await fetch(`${LLM_BASE_URL}/download-json`);
            if (!response.ok) throw new Error('Failed to load test results');
            const data = await response.json();
            setVisualizationData(JSON.stringify(data, null, 2));
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load test results', variant: 'destructive' });
        } finally {
            setIsLoadingResults(false);
        }
    };

    const downloadPDF = () => {
        if (!testCaseDetails) {
            toast({
                title: 'Error',
                description: 'No test case details to download',
                variant: 'destructive',
            });
            return;
        }

        const doc = new jsPDF();
        const lines = doc.splitTextToSize(testCaseDetails, 180);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(lines, 15, 20);

        doc.save('test-case-details.pdf');
    };


    const downloadJSON = () => {
        if (!visualizationData) {
            toast({ title: 'Error', description: 'No test results to download', variant: 'destructive' });
            return;
        }
        const blob = new Blob([visualizationData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'test-results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="px-0.5 font-poppins bg-gray-50 h-screen overflow-y-auto">
            <Tabs defaultValue="generate" className="max-w-6xl mx-auto">
                <TabsList className="grid grid-cols-2 w-full bg-white shadow-md rounded-lg overflow-hidden sticky top-0 z-50">
                    <TabsTrigger
                        value="generate"
                        className="text-lg h-full flex items-center justify-center data-[state=active]:bg-blue-50 data-[state=active]:text-[#0F2F61] transition"
                    >
                        🧪 Generate
                    </TabsTrigger>
                    <TabsTrigger
                        value="results"
                        className="text-lg h-full flex items-center justify-center data-[state=active]:bg-blue-50 data-[state=active]:text-[#0F2F61] transition"
                    >
                        📊 Results
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="generate" className="space-y-6">
                    <Card className="shadow-lg rounded-xl border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-[#0F2F61]">Generate Test Cases</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">User Story</Label>
                                <Textarea
                                    className="mt-1 shadow-sm focus:ring-[#0F2F61] focus:border-[#0F2F61]"
                                    value={userStory}
                                    onChange={(e) => setUserStory(e.target.value)}
                                    placeholder="As a user, I want to..."
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-[#0F2F61]">Number of Test Cases</Label>
                                <Input
                                    type="number"
                                    value={numTestCases}
                                    onChange={(e) => setNumTestCases(parseInt(e.target.value) || 5)}
                                    min={1}
                                    max={20}
                                    className="mt-1 shadow-sm focus:ring-[#0F2F61] focus:border-[#0F2F61]"
                                />
                            </div>
                            <Button
                                onClick={generateTestCases}
                                disabled={isGenerating}
                                className="bg-[#0F2F61] hover:bg-[#0F2F61] text-white transition"
                            >
                                {isGenerating ? 'Generating...' : 'Generate'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg rounded-xl border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-[#0F2F61]">Test Case Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <pre className="bg-gray-100 p-4 rounded-md max-h-[300px] overflow-y-auto text-sm whitespace-pre-wrap border border-gray-200 shadow-inner">
                                {testCaseDetails || 'No test cases yet...'}
                            </pre>
                            <Button
                                onClick={downloadPDF}
                                disabled={!testCaseDetails}
                                variant="outline"
                                className="hover:bg-gray-100 transition"
                            >
                                ⬇️ Download Details
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Test Execution and Results --- */}
                <TabsContent value="results" className="space-y-6">
                    <Card className="shadow-lg rounded-xl border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-[#0F2F61]">Execute Test Cases</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Test URL</Label>
                                <Input
                                    type="url"
                                    value={testUrl}
                                    onChange={(e) => setTestUrl(e.target.value)}
                                    className="mt-1 shadow-sm focus:ring-[#0F2F61] focus:border-[#0F2F61]"
                                />
                            </div>
                            <pre className="bg-gray-100 p-4 rounded-md max-h-[300px] overflow-y-auto text-sm whitespace-pre-wrap border border-gray-200 shadow-inner">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        a: ({ node, ...props }) => (
                                            <a
                                                {...props}
                                                className="text-[#2964AA] underline hover:opacity-80 transition"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        table: ({ node, ...props }) => (
                                            <div className="overflow-x-auto">
                                                <table
                                                    className="min-w-full border-separate border-spacing-y-1 rounded-lg overflow-hidden shadow-md text-xs md:text-sm"
                                                    {...props}
                                                />
                                            </div>
                                        ),
                                        thead: ({ node, ...props }) => (
                                            <thead className="bg-blue-700 text-white border-b border-blue-400" {...props} />
                                        ),
                                        th: ({ node, ...props }) => (
                                            <th
                                                className="px-2 md:px-4 py-1 md:py-2 text-left border-b border-blue-400 text-xs md:text-sm"
                                                {...props}
                                            />
                                        ),
                                        tbody: ({ node, ...props }) => <tbody {...props} />,
                                        tr: ({ node, ...props }) => (
                                            <tr className="bg-gray-800 hover:bg-gray-700 border-b border-gray-700" {...props} />
                                        ),
                                        td: ({ node, ...props }) => (
                                            <td
                                                className="px-2 md:px-4 py-1 md:py-2 align-top border-b border-gray-700 text-xs md:text-sm"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul className="list-disc list-inside space-y-1 pl-4" {...props} />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol className="list-decimal list-inside space-y-1 pl-4" {...props} />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li className="mb-1 leading-relaxed" {...props} />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p className="mb-2 leading-relaxed text-gray-300" {...props} />
                                        ),
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-400 my-4" {...props} />
                                        )
                                    }
                                    }
                                >
                                    {urlTestCaseDetails?.output
                                        ? `\`\`\`bash\n${urlTestCaseDetails.output.replace(/\\n/g, '\n')}\n\`\`\``
                                        : 'No execution output yet...'}
                                </ReactMarkdown>
                            </pre>
                            <Button
                                onClick={executeTestCases}
                                disabled={isExecuting}
                                className="bg-[#0F2F61] text-white transition"
                            >
                                {isExecuting ? 'Executing...' : 'Execute'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg rounded-xl border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-[#0F2F61]">Visualization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <Tabs defaultValue="json" className="w-full">
                                <TabsList className="bg-gray-100 p-1 rounded-md border mb-2 w-fit">
                                    <TabsTrigger value="json">JSON Output</TabsTrigger>
                                    <TabsTrigger value="chart">Chart</TabsTrigger>
                                </TabsList>

                                <TabsContent value="json">
                                    <pre className="bg-gray-100 p-4 rounded-md max-h-[300px] overflow-y-auto text-sm whitespace-pre-wrap border border-gray-200 shadow-inner">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                a: ({ node, ...props }) => (
                                                    <a
                                                        {...props}
                                                        className="text-[#2964AA] underline hover:opacity-80 transition"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    />
                                                ),
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto">
                                                        <table
                                                            className="min-w-full border-separate border-spacing-y-1 rounded-lg overflow-hidden shadow-md text-xs md:text-sm"
                                                            {...props}
                                                        />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => (
                                                    <thead className="bg-blue-700 text-white border-b border-blue-400" {...props} />
                                                ),
                                                th: ({ node, ...props }) => (
                                                    <th
                                                        className="px-2 md:px-4 py-1 md:py-2 text-left border-b border-blue-400 text-xs md:text-sm"
                                                        {...props}
                                                    />
                                                ),
                                                tbody: ({ node, ...props }) => <tbody {...props} />,
                                                tr: ({ node, ...props }) => (
                                                    <tr className="bg-gray-800 hover:bg-gray-700 border-b border-gray-700" {...props} />
                                                ),
                                                td: ({ node, ...props }) => (
                                                    <td
                                                        className="px-2 md:px-4 py-1 md:py-2 align-top border-b border-gray-700 text-xs md:text-sm"
                                                        {...props}
                                                    />
                                                ),
                                                ul: ({ node, ...props }) => (
                                                    <ul className="list-disc list-inside space-y-1 pl-4" {...props} />
                                                ),
                                                ol: ({ node, ...props }) => (
                                                    <ol className="list-decimal list-inside space-y-1 pl-4" {...props} />
                                                ),
                                                li: ({ node, ...props }) => (
                                                    <li className="mb-1 leading-relaxed" {...props} />
                                                ),
                                                p: ({ node, ...props }) => (
                                                    <p className="mb-2 leading-relaxed text-gray-300" {...props} />
                                                ),
                                                blockquote: ({ node, ...props }) => (
                                                    <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-400 my-4" {...props} />
                                                )
                                            }
                                            }
                                        >
                                            {visualizationData
                                                ? `\`\`\`json\n${visualizationData.replace(/\\n/g, "\n")}\n\`\`\``
                                                : "No visualization data yet..."}
                                        </ReactMarkdown>
                                    </pre>
                                </TabsContent>

                                <TabsContent value="chart">
                                    <div className="h-64">
                                        {urlTestCaseDetails && <PieChart data={urlTestCaseDetails} />}
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <Button
                                onClick={downloadJSON}
                                disabled={!visualizationData}
                                variant="outline"
                                className="hover:bg-gray-100 transition z-10 relative"
                            >
                                ⬇️ Download JSON
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TestCase;