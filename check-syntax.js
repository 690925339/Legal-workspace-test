// Quick syntax check by trying to parse the file
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf-8');

try {
    // Try to evaluate in a safe context
    new Function(content);
    console.log('✓ No syntax errors detected');
} catch (error) {
    console.error('✗ Syntax error found:');
    console.error(error.message);
    console.error('Line:', error.lineNumber || 'unknown');
}
