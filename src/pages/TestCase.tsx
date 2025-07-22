import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { jsPDF } from 'jspdf';
import PieChart from '@/components/PieChart';
import { BarChart2, FileCode2 } from 'lucide-react';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

const LLM_BASE_URL = 'http://15.206.121.90:5001';

const TestCase = () => {
    const [userStory, setUserStory] = useState(
        'As a new customer, I want to be able to easily apply for a car insurance policy online by providing basic personal and vehicle details, so that I can receive a quote and start coverage quickly.'
    );
    const markdownRef = useRef<HTMLDivElement>(null);

    const [numTestCases, setNumTestCases] = useState(5);
    const [testCaseDetails, setTestCaseDetails] = useState('');
    const [urlTestCaseDetails, setUrlTestCaseDetails] = useState<any>(null);
    const [testUrl, setTestUrl] = useState('https://www.acko.com/car-insurance/');
    const [visualizationData, setVisualizationData] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isLoadingResults, setIsLoadingResults] = useState(false);

    const generateTestCases = async () => {
        if (!userStory.trim()) {
            toast("Error", {
                description: "Please provide a user story to test",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
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
            toast("Success!", {
                description: "Test cases generated successfully",
                icon: <CheckCircle2 className="text-green-600" />,
                className: "bg-green-100 text-green-900"
            });
        } catch (error) {
            toast("Error", {
                description: "Failed to generate test cases",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const executeTestCases = async () => {
        if (!testUrl.trim()) {
            toast("Error", {
                description: "Please provide a test URL",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
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
            toast("Success!", {
                description: "Test cases executed successfully",
                icon: <CheckCircle2 className="text-green-600" />,
                className: "bg-green-100 text-green-900"
            });
            loadVisualizationData();
        } catch (error) {
            toast("Error", {
                description: "Failed to generate test cases",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
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
            toast("Error", {
                description: "Failed to load test results",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
        } finally {
            setIsLoadingResults(false);
        }
    };

    const downloadOutput = () => {
        const output = urlTestCaseDetails?.output;
      
        if (!output) {
            toast("Error", {
                description: "Failed to load test results",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
          return;
        }
      
        const doc = new jsPDF();
        const cleanText = output.replace(/\\n/g, '\n');
        const lines = doc.splitTextToSize(cleanText, 180);
      
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
      
        let y = 20;
        const lineHeight = 7;
        const pageHeight = doc.internal.pageSize.getHeight();
      
        lines.forEach((line) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 15, y);
          y += lineHeight;
        });
      
        doc.save('execution-output.pdf');
      };      

    const downloadPDF = async () => {
        if (!markdownRef.current) {
            toast("Error", {
                description: "Nothing to download",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
            return;
        }

        const canvas = await html2canvas(markdownRef.current, {
            scale: 4,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('test-case-details.pdf');
    };

    const downloadJsonPDF = () => {
        if (!visualizationData) {
            toast("Error", {
                description: "No test results to download",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-900"
            });
            return;
        }

        const doc = new jsPDF();
        const margin = 15;
        const lineHeight = 4;
        const pageHeight = doc.internal.pageSize.height;
        const maxLineY = pageHeight - margin;

        const jsonText = typeof visualizationData === 'string'
            ? visualizationData
            : JSON.stringify(visualizationData, null, 2);

        const lines = doc.splitTextToSize(jsonText, 180);
        let y = margin;

        doc.setFont('courier', 'normal');
        doc.setFontSize(10);

        lines.forEach((line) => {
            if (y + lineHeight > maxLineY) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });

        doc.save('test-results.pdf');
    };

    const testCaseDetail = testCaseDetails
        ?.replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        ?? 'No execution output yet...';

    return (
        <div className="px-0.5 font-poppins bg-gray-50 h-screen overflow-y-auto">
            <Tabs defaultValue="generate" className="max-w-6xl mx-auto">
                <TabsList className="flex w-full p-1 rounded-xl shadow-md sticky top-0 z-50 border border-gray-200">
                    <TabsTrigger
                        value="generate"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 text-base font-medium rounded-lg transition-all duration-200
               text-gray-700 hover:bg-blue-100/40
               data-[state=active]:bg-white data-[state=active]:text-[#0F2F61] data-[state=active]:shadow-sm"
                    >
                        <FileCode2 size={18} />
                        Generate
                    </TabsTrigger>

                    <TabsTrigger
                        value="results"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 text-base font-medium rounded-lg transition-all duration-200
               text-gray-700 hover:bg-blue-100/40
               data-[state=active]:bg-white data-[state=active]:text-[#0F2F61] data-[state=active]:shadow-sm"
                    >
                        <BarChart2 size={18} />
                        Results
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
                                <div ref={markdownRef}>
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
                                                <li className="leading-relaxed" {...props} />
                                            ),
                                            p: ({ node, ...props }) => (
                                                <p className="leading-relaxed text-gray-900" {...props} />
                                            ),
                                            blockquote: ({ node, ...props }) => (
                                                <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-400 my-4" {...props} />
                                            )
                                        }
                                        }
                                    >
                                        {testCaseDetail || 'No test cases yet...'}
                                    </ReactMarkdown>
                                </div>
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
                                <div ref={markdownRef}>
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
                                </div>
                            </pre>
                            <Button
                                onClick={executeTestCases}
                                disabled={isExecuting}
                                className="bg-[#0F2F61] text-white transition"
                            >
                                {isExecuting ? 'Executing...' : 'Execute'}
                            </Button>
                            <Button
                                onClick={downloadOutput}
                                disabled={isExecuting}
                                variant="outline"
                                className="ml-2 hover:bg-gray-100 transition z-10 relative"
                            >
                                ⬇️ Download details
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg rounded-xl border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-[#0F2F61]">Visualization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="chart" className="w-full">
                                <TabsList className="bg-gray-100 p-1 rounded-md border mb-2 w-fit">
                                    <TabsTrigger value="chart">Chart</TabsTrigger>
                                    <TabsTrigger value="json">JSON Output</TabsTrigger>
                                </TabsList>

                                <TabsContent value="json">
                                    <pre className="bg-gray-100 p-4 rounded-md max-h-[300px] overflow-y-auto text-sm whitespace-pre-wrap border border-gray-200 shadow-inner">
                                        <div ref={markdownRef}>
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
                                        </div>
                                    </pre>
                                </TabsContent>

                                <TabsContent value="chart">
                                    <div className="h-64">
                                        {urlTestCaseDetails && <PieChart data={urlTestCaseDetails} />}
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <Button
                                onClick={downloadJsonPDF}
                                disabled={!visualizationData}
                                variant="outline"
                                className="hover:bg-gray-100 transition z-10 relative"
                            >
                                ⬇️ Download JSON details
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TestCase;