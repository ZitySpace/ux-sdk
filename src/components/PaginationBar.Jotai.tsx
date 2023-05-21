import React, { useEffect } from 'react';

const PaginationBar = () => {
  useEffect(() => {
    console.log('useEffect called');
  }, []);

  return <div className='w-full us-bg-indigo-400'>hello world</div>;
};

export default PaginationBar;
