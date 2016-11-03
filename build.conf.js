module.exports = {
    module: {
        name: 'pipSettings',
        styles: 'settings',
        export: 'pip.settings',
        standalone: 'pip.settings'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        less: true,
        lib: true,
        images: true,
        dist: false
    },
    file: {
        lib: [
            '../pip-webui-test/dist/**/*',
            '../pip-webui-lib/dist/**/*',
            '../pip-webui-css/dist/**/*',
            '../pip-webui-lists/dist/**/*',
            //'../pip-webui-rest/dist/**/*',
            '../pip-webui-data/dist/**/*',
            '../pip-webui-controls/dist/**/*',
            '../pip-webui-nav/dist/**/*',
            '../pip-webui-layouts/dist/**/*',
            '../pip-webui-services/dist/**/*',
            //'../pip-webui-locations/dist/**/*',
            //'../pip-webui-documents/dist/**/*',
            //'../pip-webui-composite/dist/**/*',
            '../pip-webui-errors/dist/**/*',
            '../pip-webui-entry/dist/**/*',
            '../pip-webui-settings/dist/**/*',
            '../pip-webui-behaviors/dist/**/*',
            // '../pip-webui-support/dist/**/*',
            //'../pip-webui-help/dist/**/*'
        ]
    },
    samples: {
        port: 8150
    },
    api: {
        port: 8151
    }
};
