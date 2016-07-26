module.exports = {
    module: {
        name: 'pipSettings',
        index: 'settings'
    },
    build: {
        js: true,
        ts: true,
        html: true,
        css: true,
        lib: true,
        images: true
    },
    file: {
        import: [
            '../pip-webui-test/dist/**/*',
            '../pip-webui-lib/dist/**/*',
            '../pip-webui-css/dist/**/*',
            '../pip-webui-core/dist/**/*',
            '../pip-webui-rest/dist/**/*',
            '../pip-webui-controls/dist/**/*',
            '../pip-webui-nav/dist/**/*',
            '../pip-webui-layouts/dist/**/*',
            '../pip-webui-pictures/dist/**/*',
            '../pip-webui-locations/dist/**/*',
            '../pip-webui-documents/dist/**/*',
            '../pip-webui-composite/dist/**/*',
            '../pip-webui-errors/dist/**/*',
            '../pip-webui-entry/dist/**/*',
            '../pip-webui-settings/dist/**/*',
            //'../pip-webui-guidance/dist/**/*',
            // '../pip-webui-support/dist/**/*',
            //'../pip-webui-help/dist/**/*'
        ]
    },
    samples: {
        port: 8030,
        publish: {
            bucket: 'webui.pipdevs.com',
            accessKeyId: 'AKIAIEXTTAEEHYPHS3OQ',
            secretAccessKey: 'otMg2vQLZjF4Nkb90j1prtugoUCNm3XqLS/KkHyc',
            region: 'us-west-1'
        }
    }
};