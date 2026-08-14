/**
 * Test file to validate resume generator functionality
 * This file is for development testing purposes only
 */

import { generateResume, formatResumeForStorage } from './resumeGenerator';
import { RESUME_TEMPLATES } from '../constants/resumeTemplates';

async function testResumeGeneration() {
  console.log('Testing Resume Generation...');
  
  // Test data
  const testData = {
    jobTitle: 'Software Engineer',
    jobDescription: 'We are looking for a skilled Software Engineer with experience in React, TypeScript, and Node.js to join our team.',
    experience: '5 years as a frontend developer specializing in React applications. 3 years experience with TypeScript and modern JavaScript frameworks.',
    skills: 'React, TypeScript, JavaScript, HTML/CSS, Node.js, Git, REST APIs',
    education: 'B.S. Computer Science, University of Technology, 2018',
    template: 'professional'
  };

  try {
    // Test prompt generation
    const prompt = await generateResume(testData);
    console.log('Prompt generated successfully');
    console.log('Prompt length:', prompt.length);
    
    // Test data formatting
    const formattedData = formatResumeForStorage(testData, 'Sample resume content');
    console.log('Data formatted successfully');
    console.log('Formatted data keys:', Object.keys(formattedData));
    
    // Test template access
    console.log('Available templates:', Object.keys(RESUME_TEMPLATES));
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  testResumeGeneration();
}

export { testResumeGeneration };