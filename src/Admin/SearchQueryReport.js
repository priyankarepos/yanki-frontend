import React from 'react';
import Typography from '@mui/material/Typography';

const SearchQueryReport = () => {
  // Mock data for search queries
  const searchQueries = [
    'User query 1',
    'User query 2',
    'User query 3',
    // Add more queries as needed
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Search Query Report
      </Typography>

      {searchQueries.length === 0 ? (
        <p>No search queries have been recorded at the moment.</p>
      ) : (
        <div>
          {searchQueries.map((query, index) => (
            <div key={index}>
              <p>Query Text: {query}</p>
              {/* Add more information about the query here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchQueryReport;