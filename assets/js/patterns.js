new Vue({

    el: 'html',

    ready: function() {
        this.loadDataFile();
    },

    methods: {

        /**
         * Reads the patterns.json file.
         *
         * @return {undefined}
         */
        loadDataFile: function() {
            var _this = this;

            $.get('patterns.json', function(data) {
                _this.$data = data;
                _this.componentsLoaded = 0;

                _this.setupGroups();
                _this.loadComponents();

                if (_this.font_libraries.typekit_code) {
                    _this.loadTypekit();
                }
            });
        },

        /**
         * Loads TypeKit
         *
         * @return {undefined}
         */
        loadTypekit: function() {
            $.getScript('https://use.typekit.net/' + this.font_libraries.typekit_code + '.js', function() {
                try{Typekit.load({ async: true });}catch(e){};
            });
        },

        loadScripts: function() {
            for (var i = 0; i < this.assets.js.length; i++) {
                $('body').append('<script src="' + this.assets.js[i] + '"></script>');
            }
        },

        loadComponents: function() {
            for (var i = 0; i < this.groups.length; i++) {
                for (var j = 0; j < this.groups[i].components.length; j++) {
                    var component = this.groups[i].components[j];

                    this.loadComponent(component);
                }
            }
        },

        loadComponent: function(component) {
            var _this = this;

            $.get('components/' + component.template + '.html', function(data) {
                component.html = data;
            }).always(function() {
                _this.incrementComponentsLoaded();
            });

            $.get('components/' + component.template + '.md', function(data) {
                component.description = marked(data);
            }).always(function() {
                _this.incrementComponentsLoaded();
            });
        },

        incrementComponentsLoaded: function() {
            this.componentsLoaded += 1;

            if (this.componentsLoaded === this.components.length * 2) {
                /**
                 * Load custom JavaScripts
                 */
                this.loadScripts();

                /**
                 * Initialize code highlighting
                 */
                $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                });
            }
        },

        setupGroups: function() {
            // Loop through the groups
            for (var i = 0; i < this.groups.length; i++) {
                var group = this.groups[i];
                group.components = [];

                for (var j = 0; j < this.components.length; j++) {
                    if (this.components[j].group === group.name) {
                        // Add html and description properties to the component object.
                        this.$set('components[' + j + '].html', '');
                        this.$set('components[' + j + '].description', '')

                        group.components.push(this.components[j]);
                    }
                }
            }
        }

    }

});
