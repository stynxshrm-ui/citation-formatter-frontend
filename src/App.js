import React, { useState } from 'react';
import ReferenceInput from './components/ReferenceInput';

// Import shared formatting functions (could be moved to a shared utility)
function formatCitation(paper, style = 'apa') {
  if (!paper) return "No results found";
  
  const title = paper.title || "Unknown title";
  const year = paper.year || "Unknown year";
  const journal = paper.journal || paper.venue || "Unknown journal";
  
  let authors = "Unknown author";
  if (paper.authors && paper.authors.length > 0) {
    let authorList;
    
    // Format authors according to citation style
    switch (style) {
      case 'mla':
        // MLA: Full first name + last name
        authorList = paper.authors.map(author => {
          const family = author.family || author.lastName || "Unknown";
          const given = author.given || author.firstName || "";
          return given ? `${family}, ${given}` : family;
        });
        break;
      case 'vancouver':
        // Vancouver: Last name + first initial
        authorList = paper.authors.map(author => {
          const family = author.family || author.lastName || "Unknown";
          const given = author.given || author.firstName || "";
          return given ? `${family} ${given.charAt(0)}` : family;
        });
        break;
      default:
        // APA and others: Last name + first initial
        authorList = paper.authors.map(author => {
          const family = author.family || author.lastName || "Unknown";
          const given = author.given || author.firstName || "";
          return given ? `${family}, ${given.charAt(0)}.` : family;
        });
    }
    
    // Format author list with appropriate separators
    if (authorList.length === 1) {
      authors = authorList[0];
    } else if (authorList.length > 1) {
      if (style === 'mla') {
        authors = authorList.slice(0, -1).join(', ') + ', and ' + authorList[authorList.length - 1];
      } else if (style === 'vancouver') {
        authors = authorList.join(', ');
      } else {
        authors = authorList.slice(0, -1).join(', ') + ' & ' + authorList[authorList.length - 1];
      }
    }
  }
  
  // Handle conference proceedings vs journal articles
  let venue = journal;
  if (journal && (journal.toLowerCase().includes('proceedings') || 
                  journal.toLowerCase().includes('conference') || 
                  journal.toLowerCase().includes('cvpr') ||
                  journal.toLowerCase().includes('iccv') ||
                  journal.toLowerCase().includes('eccv') ||
                  journal.toLowerCase().includes('nips') ||
                  journal.toLowerCase().includes('icml'))) {
    // Clean up conference names - remove year if it's already in the title
    let cleanJournal = journal;
    if (cleanJournal.includes(year.toString())) {
      cleanJournal = cleanJournal.replace(year.toString(), '').replace(/\s*,\s*/, '').trim();
    }
    venue = `Proceedings of the ${cleanJournal}`;
  }
  
  switch (style) {
    case 'mla':
      return `${authors}. "${title}." ${venue}, ${year}.`;
    case 'chicago':
      return `${authors}. "${title}." ${venue} ${year}.`;
    case 'harvard':
      return `${authors} (${year}) '${title}', ${venue}.`;
    case 'vancouver':
      return `${authors}. ${title}. ${venue}. ${year}.`;
    case 'ieee':
      return `${authors}, "${title}," ${venue}, ${year}.`;
    case 'ama':
      return `${authors}. ${title}. ${venue}. ${year}.`;
    case 'asa':
      return `${authors}. ${year}. "${title}." ${venue}.`;
    case 'apa':
    default:
      return `${authors} (${year}). ${title}. ${venue}.`;
  }
}

function App() {
  const [references, setReferences] = useState('');
  const [formattedResults, setFormattedResults] = useState([]);
  const [papers, setPapers] = useState([]);
  const [notFound, setNotFound] = useState([]);
  const [multipleMatches, setMultipleMatches] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('apa');
  const [isLoading, setIsLoading] = useState(false);
  const [isReformatting, setIsReformatting] = useState(false);
  const [error, setError] = useState('');

  const handleFormatReferences = async () => {
    if (!references.trim()) {
      setError('Please enter some references to format.');
      return;
    }

    console.log('Sending references:', references); // Debug log
    setIsLoading(true);
    setError('');
    setFormattedResults([]);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/format`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ references: references, format: selectedFormat }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      setFormattedResults(results.formatted || []);
      setPapers(results.papers || []);
      setNotFound(results.notFound || []);
      setMultipleMatches(results.multipleMatches || []);
    } catch (err) {
      console.error('Error formatting references:', err);
      setError('Failed to format references. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setReferences('');
    setFormattedResults([]);
    setPapers([]);
    setNotFound([]);
    setMultipleMatches([]);
    setError('');
  };

  const handleDownload = async (format) => {
    if (!references.trim()) {
      setError('Please enter some references to download.');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ references: references, format: format }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || `references.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading references:', err);
      setError('Failed to download references. Please try again.');
    }
  };

  const handleFormatChange = async (newFormat) => {
    setSelectedFormat(newFormat);
    
    // If we have papers data, re-format them with the new style
    if (papers.length > 0) {
      setIsReformatting(true);
      setError('');
      
      try {
        // Re-format the existing papers data instead of re-fetching
        const newFormattedResults = formattedResults.map((result, index) => {
          const paper = papers[index];
          if (paper && result !== "No results found" && result !== "Multiple matches found - please select one" && result !== "Multiple references found") {
            // Re-format the existing paper with new style
            return formatCitation(paper, newFormat);
          }
          return result; // Keep existing result for "No results found" or multiple matches
        });
        
        setFormattedResults(newFormattedResults);
      } catch (err) {
        console.error('Error re-formatting references:', err);
        setError('Failed to re-format references. Please try again.');
      } finally {
        setIsReformatting(false);
      }
    }
  };

  const handleSelectOption = async (referenceIndex, selectedOptionIndex) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/select-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          referenceIndex: referenceIndex, 
          selectedOptionIndex: selectedOptionIndex 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the formatted results with the new selection
      const newFormattedResults = [...formattedResults];
      const match = multipleMatches.find(m => m.index === referenceIndex);
      if (match && match.options[selectedOptionIndex]) {
        newFormattedResults[referenceIndex] = match.options[selectedOptionIndex].formatted;
        setFormattedResults(newFormattedResults);
      }

      // Remove the resolved match from multipleMatches
      const newMultipleMatches = multipleMatches.filter(m => m.index !== referenceIndex);
      setMultipleMatches(newMultipleMatches);

    } catch (err) {
      console.error('Error selecting option:', err);
      setError('Failed to select option. Please try again.');
    }
  };

  const handleSelectNone = async (referenceIndex) => {
    try {
      // Keep "Multiple references found" text in the formatted results
      const newFormattedResults = [...formattedResults];
      newFormattedResults[referenceIndex] = "Multiple references found";
      setFormattedResults(newFormattedResults);

      // Remove the resolved match from multipleMatches
      const newMultipleMatches = multipleMatches.filter(m => m.index !== referenceIndex);
      setMultipleMatches(newMultipleMatches);

    } catch (err) {
      console.error('Error selecting none:', err);
      setError('Failed to process selection. Please try again.');
    }
  };



  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Citation Formatter</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Paste your references below, one per line, and get them formatted in your preferred citation style. Download in BibTeX or EndNote formats.
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <ReferenceInput
          references={references}
          setReferences={setReferences}
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
          onFormatReferences={handleFormatReferences}
          onClear={handleClear}
          isLoading={isLoading}
        />

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '6px',
            border: '1px solid #f5c6cb'
          }}>
            <p style={{ margin: 0, fontWeight: '500' }}>{error}</p>
          </div>
        )}

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>Formatting your references...</p>
          </div>
        )}

        {notFound.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ color: '#dc3545', margin: 0 }}>❌ References Not Found</h2>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              The following references could not be found in our databases. Please check the spelling or try using a DOI.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notFound.map((item, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '6px',
                  border: '1px solid #f5c6cb'
                }}>
                  <div style={{ color: '#721c24', fontWeight: '500' }}>
                    Reference {item.index + 1}: "{item.query}"
                  </div>
                  <div style={{ fontSize: '14px', color: '#721c24', marginTop: '4px' }}>
                    Suggestion: Try using the full title, DOI, or check for typos
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {multipleMatches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ color: '#ffc107', margin: 0 }}>⚠️ Multiple Matches Found</h2>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Some references had multiple matches. Please select the correct paper for each reference.
            </p>
            {multipleMatches.map((match, matchIndex) => (
              <div key={matchIndex} style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderRadius: '6px',
                border: '1px solid #ffeaa7'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '10px' 
                }}>
                  <h4 style={{ color: '#856404', margin: 0, fontSize: '16px' }}>
                    Query: "{match.query}"
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSelectNone(match.index)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: '#6c757d',
                      color: 'white',
                    }}
                  >
                    Select None
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {match.options.map((option, optIndex) => (
                    <div key={optIndex} style={{
                      padding: '10px',
                      backgroundColor: optIndex === 0 ? '#e2e3e5' : 'white',
                      borderRadius: '4px',
                      border: optIndex === 0 ? '2px solid #007bff' : '1px solid #dee2e6',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: '#333' }}>
                          {optIndex === 0 ? '✓ Currently Selected: ' : `${optIndex + 1}. `}{option.title}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {option.authors?.map(a => a.family || a.lastName || 'Unknown').join(', ')} • {option.year} • {option.journal}
                        </div>
                      </div>
                      {optIndex !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSelectOption(match.index, optIndex)}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: '#007bff',
                            color: 'white',
                            marginLeft: '10px',
                          }}
                        >
                          Select This
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {formattedResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#333', margin: 0 }}>Formatted References</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  onClick={() => handleDownload(selectedFormat)}
                  disabled={isReformatting}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isReformatting ? 'not-allowed' : 'pointer',
                    backgroundColor: isReformatting ? '#6c757d' : '#28a745',
                    color: 'white',
                  }}
                >
                  Download {selectedFormat.toUpperCase()}
                </button>
                <button 
                  type="button"
                  onClick={() => handleDownload('bibtex')}
                  disabled={isReformatting}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isReformatting ? 'not-allowed' : 'pointer',
                    backgroundColor: isReformatting ? '#6c757d' : '#17a2b8',
                    color: 'white',
                  }}
                >
                  Download BibTeX
                </button>
                <button 
                  type="button"
                  onClick={() => handleDownload('endnote')}
                  disabled={isReformatting}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isReformatting ? 'not-allowed' : 'pointer',
                    backgroundColor: isReformatting ? '#6c757d' : '#6f42c1',
                    color: 'white',
                  }}
                >
                  Download EndNote
                </button>
              </div>
            </div>
            {isReformatting ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#666',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '2px dashed #dee2e6'
              }}>
                <p style={{ margin: 0, fontSize: '1rem' }}>
                  Reformatting references in {selectedFormat.toUpperCase()} style...
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {formattedResults.map((result, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    borderLeft: '4px solid #007bff'
                  }}>
                    <span style={{ color: '#007bff', fontWeight: '600', minWidth: '30px' }}>
                      {index + 1}.
                    </span>
                    <span style={{ color: '#333', flex: 1 }}>{result}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 
