/*global fireEvent, selectElementContents */

describe('Core-API', function () {
    'use strict';

    beforeEach(function () {
        setupTestHelpers.call(this);
        this.el = this.createElement('div', 'editor', 'lore ipsum');
    });

    afterEach(function () {
        this.cleanupTest();
    });

    describe('getFocusedElement', function () {
        it('should return the element which currently has a data-medium-focused attribute', function () {
            var elementOne = this.createElement('div', 'editor', 'lorem ipsum'),
                elementTwo = this.createElement('div', 'editor', 'lorem ipsum');
            elementTwo.setAttribute('data-medium-focused', true);

            var editor = this.newMediumEditor('.editor'),
                focused = editor.getFocusedElement();
            expect(focused).not.toBe(elementOne);
            expect(focused).toBe(elementTwo);
        });

        it('should return the element focused via call to selectElement', function () {
            var elementOne = this.createElement('div', 'editor', 'lorem ipsum'),
                elementTwo = this.createElement('div', 'editor', 'lorem ipsum');
            elementTwo.setAttribute('data-medium-focused', true);

            var editor = this.newMediumEditor('.editor');

            editor.selectElement(elementOne.firstChild);
            var focused = editor.getFocusedElement();
            expect(focused).toBe(elementOne);
        });
    });

    describe('setContent', function () {
        it('should set the content of the editor\'s element', function () {
            var newHTML = 'Lorem ipsum dolor',
                otherHTML = 'something different',
                elementOne = this.createElement('div', 'editor', 'lorem ipsum'),
                editor = this.newMediumEditor('.editor');

            editor.setContent(newHTML);
            expect(this.el.innerHTML).toEqual(newHTML);
            expect(elementOne.innerHTML).not.toEqual(newHTML);

            editor.setContent(otherHTML, 1);
            expect(elementOne.innerHTML).toEqual(otherHTML);
            expect(this.el.innerHTML).not.toEqual(otherHTML);
        });
    });

    describe('saveSelection/restorSelection', function () {
        it('should be applicable if html changes but text does not', function () {
            this.el.innerHTML = 'lorem <i>ipsum</i> dolor';

            var editor = this.newMediumEditor('.editor', {
                    toolbar: {
                        buttons: ['italic', 'underline', 'strikethrough']
                    }
                }),
                toolbar = editor.getExtensionByName('toolbar'),
                button,
                regex;

            // Save selection around <i> tag
            selectElementContents(editor.elements[0].querySelector('i'));
            editor.saveSelection();

            // Underline entire element
            selectElementContents(editor.elements[0]);
            button = toolbar.getToolbarElement().querySelector('[data-action="underline"]');
            fireEvent(button, 'click');

            // Restore selection back to <i> tag and add a <strike> tag
            regex = new RegExp('^<u>lorem (<i><strike>|<strike><i>)ipsum(</i></strike>|</strike></i>) dolor</u>$');
            editor.restoreSelection();
            button = toolbar.getToolbarElement().querySelector('[data-action="strikethrough"]');
            fireEvent(button, 'click');
            expect(regex.test(editor.elements[0].innerHTML)).toBe(true);
        });
    });
});
