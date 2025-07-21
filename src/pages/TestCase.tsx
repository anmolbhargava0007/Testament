import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://3.111.95.184:1929';

const TestCase = () => {
  const [userStory, setUserStory] = useState('');
  const [numTestCases, setNumTestCases] = useState(5);
  const [testCaseDetails, setTestCaseDetails] = useState('');
  const [testUrl, setTestUrl] = useState('https://www.acko.com/car-insurance/');
  const [visualizationData, setVisualizationData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const { toast } = useToast();

  const generateTestCases = async () => {
    if (!userStory.trim()) {
      toast({
        title: "Error",
        description: "Please provide a user story to test",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate_test_cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature_description: userStory,
          num_test_cases: numTestCases,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate test cases');
      }

      const data = await response.json();
      setTestCaseDetails(data.data);
      toast({
        title: "Success",
        description: "Test cases generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate test cases",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const executeTestCases = async () => {
    if (!testUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide a test URL",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/run_tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: testUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute test cases');
      }

      toast({
        title: "Success",
        description: "Test cases executed successfully",
      });

      // Automatically load visualization data after execution
      loadVisualizationData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute test cases",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const loadVisualizationData = async () => {
    setIsLoadingResults(true);
    try {
      const response = await fetch(`${API_BASE_URL}/download-json`);
      
      if (!response.ok) {
        throw new Error('Failed to load test results');
      }

      const data = await response.json();
      setVisualizationData(JSON.stringify(data, null, 2));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load test results",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResults(false);
    }
  };

  const downloadPDF = () => {
    if (!testCaseDetails) {
      toast({
        title: "Error",
        description: "No test case details to download",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([testCaseDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-case-details.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (!visualizationData) {
      toast({
        title: "Error",
        description: "No test results to download",
        variant: "destructive",
      });
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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Test Case Generation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Generate User Stories Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🔷 Generate User Stories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="userStory">Provide User Stories To Test</Label>
                <Textarea
                  id="userStory"
                  placeholder="User Story: As a new customer, I want to be able to easily apply for a car insurance policy online..."
                  value={userStory}
                  onChange={(e) => setUserStory(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="numTestCases">Number of Test Cases to Generate</Label>
                <Input
                  id="numTestCases"
                  type="number"
                  min="1"
                  max="20"
                  value={numTestCases}
                  onChange={(e) => setNumTestCases(parseInt(e.target.value) || 5)}
                  className="mt-2"
                />
              </div>
              
              <Button 
                onClick={generateTestCases}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Test Cases'}
              </Button>
            </CardContent>
          </Card>

          {/* Test Case Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🔷 Test Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md min-h-[200px] max-h-[400px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">
                  {testCaseDetails || 'No test cases generated yet...'}
                </pre>
              </div>
              
              <Button 
                onClick={downloadPDF}
                disabled={!testCaseDetails}
                variant="outline"
                className="w-full"
              >
                Download Test Case Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Execute Test Cases Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🔷 Execute Test Cases Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testUrl">Test URL</Label>
                <Input
                  id="testUrl"
                  type="url"
                  placeholder="https://www.acko.com/car-insurance/"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={executeTestCases}
                  disabled={isExecuting}
                  className="flex-1"
                >
                  {isExecuting ? 'Executing...' : 'Execute Test Cases'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {/* Download result functionality */}}
                >
                  Download Result
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🔷 Visualization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md min-h-[200px] max-h-[400px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">
                  {visualizationData || 'No test results available...'}
                </pre>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={loadVisualizationData}
                  disabled={isLoadingResults}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoadingResults ? 'Loading...' : 'Refresh Results'}
                </Button>
                
                <Button 
                  onClick={downloadJSON}
                  disabled={!visualizationData}
                  variant="outline"
                >
                  Download JSON Result
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestCase;