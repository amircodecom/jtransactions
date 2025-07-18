
**File:** `/schemas_v1/validate.js`
```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');

// Configure validator
const ajv = new Ajv({
  allErrors: true,
  strict: true,
  $data: true
});
addFormats(ajv);

// Load all schemas from directory
function loadSchemas(dir) {
  const schemas = {};
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const path = `${dir}/${dirent.name}`;
    if (dirent.isDirectory()) {
      Object.assign(schemas, loadSchemas(path));
    } else if (path.endsWith('.json')) {
      const schema = JSON.parse(fs.readFileSync(path));
      ajv.addSchema(schema, schema.$id);
      schemas[schema.$id] = schema;
    }
  });
  return schemas;
}

// Validate a transaction file
function validateTransaction(filePath) {
  try {
    const transaction = JSON.parse(fs.readFileSync(filePath));
    const valid = ajv.validate('https://yourdomain.com/schemas/v1/transaction.json', transaction);
    
    return {
      valid,
      errors: ajv.errors || [],
      transaction
    };
  } catch (err) {
    return {
      valid: false,
      errors: [err.message],
      transaction: null
    };
  }
}

// Initialize
loadSchemas('./schemas_v1');

// Command-line validation
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node validate.js <transaction_file.json>');
    process.exit(1);
  }

  const result = validateTransaction(filePath);
  console.log(`Validation ${result.valid ? 'PASSED' : 'FAILED'}`);
  if (!result.valid) {
    console.error('Errors:', result.errors);
  }
  process.exit(result.valid ? 0 : 1);
}

module.exports = {
  validateTransaction
};
