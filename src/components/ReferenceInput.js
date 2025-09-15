import React from 'react';

const ReferenceInput = ({ 
  references, 
  setReferences, 
  selectedFormat, 
  onFormatChange, 
  onFormatReferences, 
  onClear, 
  isLoading 
}) => {
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #e9ecef'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h2 style={{ margin: 0, color: '#495057' }}>References Input</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#495057' }}>Citation Style:</label>
          <select 
            value={selectedFormat} 
            onChange={(e) => onFormatChange(e.target.value)} 
            disabled={isLoading}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              backgroundColor: 'white',
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <option value="apa">APA</option>
            <option value="mla">MLA</option>
            <option value="chicago">Chicago</option>
            <option value="harvard">Harvard</option>
            <option value="vancouver">Vancouver</option>
            <option value="ieee">IEEE</option>
            <option value="ama">AMA</option>
            <option value="asa">ASA</option>
          </select>
        </div>
      </div>
      
      <textarea
        value={references}
        onChange={(e) => setReferences(e.target.value)}
        placeholder="Enter references here, one per line. You can use DOIs (e.g., 10.1038/s41586-020-2649-2) or paper titles (e.g., Deep Residual Learning for Image Recognition)..."
        rows={10}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid #ced4da',
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical',
          backgroundColor: isLoading ? '#f8f9fa' : 'white',
          cursor: isLoading ? 'not-allowed' : 'text'
        }}
      />
      
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
      }}>
        <button
          onClick={onFormatReferences}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {isLoading ? 'Formatting...' : 'Format References'}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#6c757d' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ReferenceInput; 