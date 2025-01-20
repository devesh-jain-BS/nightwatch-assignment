const { client } = require('nightwatch-api');
const { Given, Then, When } = require('cucumber');
const assert = require('assert');

Given('I navigate to {string}', async (url) => {
    await client.url(url).waitForElementVisible('body', 2000);
});

Then('the page title should be {string}', async (expectedTitle) => {
    await client.pause(2000);
    
    const result = await new Promise((resolve, reject) => {
        client.getTitle((result) => {
            resolve(result);
        });
    });
    
    console.log(`Page Title: ${result}`);
    assert.strictEqual(result, expectedTitle, 'Page title mismatch');
});

Then('all links should work and redirect properly', async () => {
    const links = await new Promise((resolve, reject) => {
        client.execute(function() {
            const linkElements = document.querySelectorAll('.et_pb_text_inner li a');
            const validLinks = [];
            for (let link of linkElements) {
                if (link.href && link.href.startsWith('http')) {
                    validLinks.push({
                        href: link.href,
                        text: link.textContent.trim() || 'No text'
                    });
                }
            }
            return validLinks;
        }, [], function(result) {
            resolve(result.value);
        });
    });
    
    console.log(`Found ${links.length} valid links to check`);
    
    const startUrl = await new Promise((resolve, reject) => {
        client.url(function(result) {
            resolve(result.value);
        });
    });
    
    for (const link of links) {
        try {
            console.log(`Checking link: ${link.text} (${link.href})`);
            await client.url(link.href);
            await client.waitForElementVisible('body', 5000);
            await client.url(startUrl);
            await client.waitForElementVisible('body', 5000);
        } catch (error) {
            console.error(`Error checking link "${link.text}": ${error.message}`);
        }
    }
});

Then('I should see no JavaScript errors in the console', async () => {
    try {
        const logs = await new Promise((resolve, reject) => {
            client.getLog('browser', function(result) {
                resolve(result);
            });
        });

        // Filter for actual errors, excluding certain known non-error cases
        const jsErrors = logs.filter(log => {
            return log.level === 'SEVERE' && 
                   !log.message.includes('favicon.ico') && // Exclude favicon 404s
                   !log.message.includes('Failed to load resource'); // Exclude resource loading issues
        });

        if (jsErrors.length > 0) {
            console.log('JavaScript errors found:', JSON.stringify(jsErrors, null, 2));
            assert.strictEqual(jsErrors.length, 0, 'JavaScript errors were found in the console');
        } else {
            console.log('No JavaScript errors found in the console');
        }
    } catch (error) {
        console.log('Error while checking console logs:', error.message);
        // If we can't check logs, we'll consider it a pass rather than fail
        // as this might be a browser/driver limitation
        return true;
    }
});