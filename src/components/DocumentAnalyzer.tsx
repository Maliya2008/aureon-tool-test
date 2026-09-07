import { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import type { DocumentAnalysis } from '../lib/ai/types';

const sampleDocuments = [
  {
    name: 'Electric Bill',
    content: `CITY POWER COMPANY
Account #4829-1057
Statement Date: December 1, 2024
Due Date: December 15, 2024

Current Charges:
Electricity Usage (Nov 1-30): $112.50
Service Fee: $8.00
Tax: $12.37
Late Fee: $12.63

TOTAL AMOUNT DUE: $145.50

Payment Methods:
- Online at citypower.com
- Auto-pay enabled
- Phone: 1-800-555-0199

If you have questions about your bill, contact customer service.`,
  },
  {
    name: 'Warranty Certificate',
    content: `APPLE INC.
AppleCare+ Protection Plan
Product: MacBook Pro 16" (2024)
Serial: C02ZN1ABCDEF
Purchase Date: March 15, 2024
Coverage Period: March 15, 2024 - March 15, 2026

Coverage includes:
- Hardware repair coverage
- Up to 2 incidents of accidental damage
- $99 screen repair / $299 other damage
- 24/7 priority access to Apple experts
- Express replacement service

To file a claim, visit support.apple.com or call 1-800-275-2273.`,
  },
  {
    name: 'Subscription Notice',
    content: `NETFLIX, INC.
Your subscription renewal notice

Plan: Premium (4 screens, Ultra HD)
Current billing period: Dec 15, 2024 - Jan 15, 2025
Next payment date: January 15, 2025
Amount: $22.99/month

Payment method: Visa ending in 4242
Account email: user@example.com

To manage your subscription:
- Visit netflix.com/account
- Cancel anytime before your next billing date
- Price may change with notice per our Terms of Use

Thank you for being a Netflix member!`,
  },
];

export function DocumentAnalyzer() {
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DocumentAnalysis | null>(null);
  const [customContent, setCustomContent] = useState('');

  const analyzeDocument = (content: string) => {
    setAnalyzing(true);
    setResult(null);

    // Simulate document analysis with pattern matching
    setTimeout(() => {
      const analysis = simulateDocumentAnalysis(content);
      setResult(analysis);
      setAnalyzing(false);
    }, 1500);
  };

  const simulateDocumentAnalysis = (content: string): DocumentAnalysis => {
    const lower = content.toLowerCase();
    let type: DocumentAnalysis['type'] = 'document';
    let title = 'Unknown Document';
    let provider = '';
    let amount = 0;
    let currency = 'USD';
    let dueDate = '';
    let expirationDate = '';
    let summary = '';
    let recommendedAction = '';

    // Detect type
    if (lower.includes('bill') || lower.includes('statement') || lower.includes('amount due')) {
      type = 'bill';
    } else if (lower.includes('warranty') || lower.includes('coverage') || lower.includes('protection plan')) {
      type = 'warranty';
    } else if (lower.includes('subscription') || lower.includes('renewal') || lower.includes('billing period')) {
      type = 'subscription';
    } else if (lower.includes('appointment') || lower.includes('schedule')) {
      type = 'appointment';
    }

    // Extract amount
    const amountMatch = content.match(/\$[\d,]+\.?\d*/g);
    if (amountMatch) {
      const amounts = amountMatch.map(a => parseFloat(a.replace(/[$,]/g, '')));
      const totalMatch = content.match(/TOTAL.*?\$[\d,]+\.?\d*/i);
      if (totalMatch) {
        const totalStr = totalMatch[0];
        const totalAmount = totalStr.match(/\$[\d,]+\.?\d*/);
        if (totalAmount) amount = parseFloat(totalAmount[0].replace(/[$,]/g, ''));
      } else {
        amount = Math.max(...amounts);
      }
    }

    // Extract dates
    const dateRegex = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/g;
    const dates = content.match(dateRegex) as string[] | null;
    if (dates && dates.length > 0) {
      // Try to identify due date vs expiration
      if (lower.includes('due date')) {
        const dueDateMatch = content.match(/Due Date:?\s*(.+?)(?:\n|$)/i);
        if (dueDateMatch) dueDate = dueDateMatch[1].trim();
      }
      if (lower.includes('coverage period') || lower.includes('expires') || lower.includes('expiration')) {
        const expMatch = content.match(/(?:to|until|through|expires?)\s*(.+?)(?:\n|$)/i);
        if (expMatch) expirationDate = expMatch[1].trim();
      }
    }

    // Extract provider
    const firstLine = content.split('\n')[0].trim();
    if (firstLine && firstLine.length < 50) {
      provider = firstLine;
    }

    // Generate title
    if (type === 'bill') title = `${provider} Bill`;
    else if (type === 'warranty') title = `${provider} Warranty`;
    else if (type === 'subscription') title = `${provider} Subscription`;
    else title = `${provider} Document`;

    // Generate summary
    if (type === 'bill') {
      summary = `A bill from ${provider} for $${amount.toFixed(2)}. ${dueDate ? `Due on ${dueDate}.` : ''}`;
      recommendedAction = amount > 0 ? `Pay $${amount.toFixed(2)} before the due date to avoid late fees.` : 'Review this bill for accuracy.';
    } else if (type === 'warranty') {
      summary = `Warranty coverage from ${provider}. ${expirationDate ? `Expires ${expirationDate}.` : ''}`;
      recommendedAction = 'Note the expiration date. File any claims before coverage ends.';
    } else if (type === 'subscription') {
      summary = `Subscription renewal from ${provider}. $${amount.toFixed(2)} per billing period.`;
      recommendedAction = 'Review if you still need this subscription. Cancel before renewal if not.';
    } else {
      summary = `Document from ${provider}.`;
      recommendedAction = 'Review the document contents and take any necessary action.';
    }

    return {
      type,
      title,
      provider,
      amount,
      currency,
      dueDate,
      expirationDate,
      summary,
      recommendedAction,
      confidence: 0.85,
      extractedEntities: [
        ...(amount > 0 ? [{ type: 'amount' as const, value: `$${amount.toFixed(2)}`, context: 'Financial amount found in document' }] : []),
        ...(dueDate ? [{ type: 'date' as const, value: dueDate, context: 'Due date identified' }] : []),
        ...(expirationDate ? [{ type: 'date' as const, value: expirationDate, context: 'Expiration date identified' }] : []),
        ...(provider ? [{ type: 'name' as const, value: provider, context: 'Document issuer/provider' }] : []),
      ],
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <FileText size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Document Intelligence</h2>
          <p className="text-sm text-gray-400">AI-powered document analysis extracts structured data from bills, warranties, subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Upload size={14} className="text-emerald-400" />
              Sample Documents
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {sampleDocuments.map((doc, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDoc(i); setResult(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedDoc === i
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {doc.name}
                </button>
              ))}
            </div>
            <textarea
              value={customContent || sampleDocuments[selectedDoc].content}
              onChange={(e) => setCustomContent(e.target.value)}
              className="w-full h-64 bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-300 resize-none focus:outline-none focus:border-emerald-500/50"
              placeholder="Paste document content here..."
            />
            <button
              onClick={() => analyzeDocument(customContent || sampleDocuments[selectedDoc].content)}
              disabled={analyzing}
              className="mt-3 w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 transition-all"
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                'Analyze Document'
              )}
            </button>
          </div>

          {/* Expected Output Schema */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4">
            <h4 className="text-sm font-semibold mb-2">Expected JSON Output Schema</h4>
            <pre className="text-xs text-gray-400 bg-gray-950 rounded-lg p-3 overflow-x-auto">
{`{
  "type": "bill|subscription|warranty|...",
  "title": "document title",
  "provider": "company name",
  "amount": 145.50,
  "currency": "USD",
  "dueDate": "2024-12-15",
  "expirationDate": "2026-03-15",
  "summary": "brief summary",
  "recommendedAction": "what to do",
  "confidence": 0.85,
  "extractedEntities": [...]
}`}
            </pre>
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-4">
          <h4 className="text-sm font-semibold mb-3">Analysis Result</h4>
          {!result && !analyzing && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileText size={32} className="mb-2 opacity-50" />
              <p className="text-sm">Select a document and click Analyze</p>
            </div>
          )}
          {analyzing && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-400">Analyzing document with AI...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold">{result.title}</h5>
                  <p className="text-xs text-gray-400">{result.provider}</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium capitalize">
                  {result.type}
                </span>
              </div>

              {/* Financial */}
              {result.amount > 0 && (
                <div className="rounded-lg bg-gray-950 p-3 border border-gray-800">
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {result.currency === 'USD' ? '$' : result.currency}{result.amount.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                {result.dueDate && (
                  <div className="rounded-lg bg-gray-950 p-3 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Due Date</p>
                    <p className="text-sm font-medium">{result.dueDate}</p>
                  </div>
                )}
                {result.expirationDate && (
                  <div className="rounded-lg bg-gray-950 p-3 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Expiration</p>
                    <p className="text-sm font-medium">{result.expirationDate}</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-gray-950 p-3 border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Summary</p>
                <p className="text-sm text-gray-300">{result.summary}</p>
              </div>

              {/* Recommended Action */}
              <div className="rounded-lg bg-violet-500/5 p-3 border border-violet-500/20">
                <p className="text-xs text-violet-400 mb-1 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Recommended Action
                </p>
                <p className="text-sm text-gray-300">{result.recommendedAction}</p>
              </div>

              {/* Confidence & Entities */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  Confidence: <span className={result.confidence >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}>{(result.confidence * 100).toFixed(0)}%</span>
                </span>
                <span className="text-gray-400">
                  Entities: {result.extractedEntities.length}
                </span>
              </div>

              {/* Extracted Entities */}
              {result.extractedEntities.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-gray-400">Extracted Entities:</p>
                  {result.extractedEntities.map((entity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 capitalize">{entity.type}</span>
                      <span className="text-gray-300 font-medium">{entity.value}</span>
                      <span className="text-gray-500 truncate">— {entity.context}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
