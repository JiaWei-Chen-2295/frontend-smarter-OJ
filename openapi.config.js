import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gatewayUrl = 'http://localhost:8101';
const generatedDir = path.resolve(__dirname, './generated_new');

// Headers provided by the user to bypass potential blocks/auth checks
const headers = {
    'Cookie': 'satoken=a95a5e0f-f1cb-40d9-bda9-9bc597057352'
};

async function fetchSpec(url) {
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error fetching spec from ${url}:`, error);
        return null;
    }
}

async function run() {
    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir, { recursive: true });
    }

    try {
        // 1. Fetch Swagger Config
        console.log(`Fetching service config from ${gatewayUrl}/v3/api-docs/swagger-config...`);
        const configContent = await fetchSpec(`${gatewayUrl}/v3/api-docs/swagger-config`);
        if (!configContent) {
            throw new Error('Failed to fetch swagger config.');
        }

        let config;
        try {
            config = JSON.parse(configContent);
        } catch (e) {
            throw new Error('Invalid JSON in swagger config.');
        }

        if (!config.urls || !Array.isArray(config.urls)) {
            throw new Error('Invalid swagger config format: "urls" array missing.');
        }

        // 2. Process each service
        for (const serviceItem of config.urls) {
            // Derive service name from context path (e.g., /api/user -> user)
            // fallback to part of the name if contextPath is missing
            const serviceNameRaw = serviceItem.contextPath ? serviceItem.contextPath.split('/').pop() : serviceItem.name;
            const serviceName = serviceNameRaw.charAt(0).toUpperCase() + serviceNameRaw.slice(1); // Capitalize: User
            const serviceUrl = `${gatewayUrl}${serviceItem.url}`;
            const serviceContextPath = serviceItem.contextPath; // e.g. /api/user

            console.log(`Processing ${serviceName} Service (${serviceUrl})...`);

            const serviceDir = path.join(generatedDir, serviceName.toLowerCase());
            const specFile = path.join(generatedDir, `${serviceName.toLowerCase()}_spec.json`);

            // Fetch the spec
            const specContent = await fetchSpec(serviceUrl);
            if (!specContent) {
                console.error(`Skipping ${serviceName} due to fetch error.`);
                continue;
            }

            // Validate JSON
            try {
                const json = JSON.parse(specContent);
                if (!json.openapi && !json.swagger) {
                    console.error(`Skipping ${serviceName}: Response is not a valid OpenAPI spec.`);
                    continue;
                }
            } catch (e) {
                console.error(`Skipping ${serviceName}: Response is not valid JSON.`);
                continue;
            }

            fs.writeFileSync(specFile, specContent);

            // Generate
            // Comment out rmSync to allow .openapi-generator-ignore to work and preserve custom configs if needed
            // if (fs.existsSync(serviceDir)) {
            //     fs.rmSync(serviceDir, { recursive: true, force: true });
            // }
            fs.mkdirSync(serviceDir, { recursive: true });

            const cmd = `npx openapi-generator-cli generate -i ${specFile} -g typescript-axios -o ${serviceDir} --skip-validate-spec --type-mappings=integer+int64=string --additional-properties=supportsES6=true,npmName=${serviceName.toLowerCase()},withSeparateModelsAndApi=true,modelPackage=model,apiPackage=api`;

            try {
                console.log(`Generating code for ${serviceName}...`);
                execSync(cmd, { stdio: 'inherit', cwd: __dirname });
                console.log(`Success: ${serviceName} Service generated.`);

                // Post-generation: Force BASE_PATH to match the contextPath (from swagger config)
                // This guarantees the frontend uses the correct gateway path (e.g. /api/user)
                if (serviceContextPath) {
                    const baseTsFile = path.join(serviceDir, 'base.ts');
                    if (fs.existsSync(baseTsFile)) {
                        let content = fs.readFileSync(baseTsFile, 'utf8');
                        // Replace the BASE_PATH line
                        const regex = /export const BASE_PATH = ".*".*;/;
                        if (regex.test(content)) {
                            content = content.replace(regex, `export const BASE_PATH = "${serviceContextPath}".replace(/\\/+$/, "");`);
                            fs.writeFileSync(baseTsFile, content);
                            console.log(`Fixed BASE_PATH in ${serviceName}/base.ts to "${serviceContextPath}"`);
                        }
                    }
                }

            } catch (error) {
                console.error(`Error generating ${serviceName} Service:`, error);
            }

            // Clean up spec file
            if (fs.existsSync(specFile)) fs.unlinkSync(specFile);
        }
    } catch (error) {
        console.error('Error during OpenAPI generation:', error);
    }
    console.log('OpenAPI generation complete.');
}

run();
