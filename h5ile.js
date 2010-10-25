/**
 *  Copyright (c) 2010 Marat Nepomnyashy    maratbn@gmail
 *  All rights reserved.
 *
 *  Module:         h5ile.js
 *
 *  Description:    JavaScript utility / helper library for HTML 5 File API
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *      * Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 *      * Redistributions in binary form must reproduce the above copyright
 *        notice, this list of conditions and the following disclaimer in the
 *        documentation and/or other materials provided with the distribution.
 *      * Neither the name of the <organization> nor the
 *        names of its contributors may be used to endorse or promote products
 *        derived from this software without specific prior written permission.
 * 
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 *  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 *
 */

window.h5ile = {
    /**
     *  Creates a visible HTML form field file input tag, prepares it to load
     *  files, and appends it as a child to the DOM element with the DOM id
     *  specified.
     *
     *  @param  idParentElement         DOM id of the parent element
     *
     *  @param  params                  JSON structure with file processing
     *                                  parameters.
     *
     *          params.loadtext         Sub-field for text loading settings.
     *
     *          params.loadtext.onloadend
     *                                  Callback function for when a file has
     *                                  been loaded as regular text.
     *                                  1st parameter:  'File' object read.
     *                                  2nd parameter:  'FileReader' object.
     *
     *  @returns the created tag.
     */
    createVisibleFileInput: function(idParentElement, params) {
        var elParent = document.getElementById(idParentElement);
        if (!elParent) throw new Error("h5ile: Invalid parent element");

        // Based on:
        // https://developer.mozilla.org/en/using_files_from_web_applications

        var elInput = document.createElement('input');
        elInput.setAttribute('type', 'file');

        var _processChange = function() {
                if (!this.files) {
                    throw new Error("h5ile:  Expected 'FileList' object, but"
                                    + " did not get any");
                }

                for (var i = 0; i < this.files.length; i++) {
                    var file = this.files[i];
                    if (!file) continue;

                    if (params &&
                        params.loadtext &&
                        params.loadtext.onloadend) {

                        var reader = new FileReader();

                        reader.onabort = function() {
                                alert("h5ile:  Aborted text loading of file '" + file.name + "'.");
                            }
                        reader.onloadend = function() {
                                params.loadtext.onloadend(file, reader);
                            }
                        reader.readAsText(file);
                    }
                }
            }

        if (elInput.addEventListener) {
            elInput.addEventListener('change', _processChange, false);
        } else if (elInput.attachEvent) {
            elInput.attachEvent('change', _processChange);
        } else {
            throw new Error("h5ile:  Expected either 'addEventListener' or 'attachEvent'.");
        }

        elParent.appendChild(elInput);

        return elInput;
    },

    /**
     *  @returns  Boolean true if the platform supports HTML 5 File API.
     */
    isFileAPISupported: function() {
        return window.File && window.FileReader ? true : false;
    }
}