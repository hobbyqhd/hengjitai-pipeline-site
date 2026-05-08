"use strict";

// Simple Image Viewer
// Version: 1.0.0
// Creates a full-screen overlay to view images when clicked

var ImageViewer = (function() {
    function ImageViewer() {
        // Initialize properties
        this.overlay = null;
        this.closeButton = null;
        this.imageContainer = null;
        this.image = null;
        this.isVisible = false;
        this.boundKeydownHandler = this.handleKeydown.bind(this);
        
        // Initialize the viewer
        this.init();
    }
    
    // Initialize the viewer
    ImageViewer.prototype.init = function() {
        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.id = 'image-viewer-overlay';
        this.overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'right: 0',
            'bottom: 0',
            'background-color: rgba(0, 0, 0, 0.9)',
            'z-index: 99999',
            'display: none',
            'align-items: center',
            'justify-content: center'
        ].join(';');
        
        // Create image container and close button
        this.overlay.innerHTML = [
            '<div class="image-container" style="position: relative; max-width: 90vw; max-height: 90vh;">',
            '  <img style="max-width: 100%; max-height: 90vh; object-fit: contain;" src="" alt="">',
            '  <button id="image-viewer-close" style="',
            '    position: absolute;',
            '    top: -20px;',
            '    right: -20px;',
            '    width: 40px;',
            '    height: 40px;',
            '    background-color: rgba(0, 0, 0, 0.7);',
            '    border: none;',
            '    border-radius: 50%;',
            '    color: white;',
            '    font-size: 20px;',
            '    cursor: pointer;',
            '    display: flex;',
            '    align-items: center;',
            '    justify-content: center;',
            '    z-index: 100000;',
            '  ">',
            '    <i class="fas fa-times"></i>',
            '  </button>',
            '</div>'
        ].join('\n');
        
        // Cache element references
        this.imageContainer = this.overlay.querySelector('.image-container');
        this.image = this.overlay.querySelector('img');
        this.closeButton = this.overlay.querySelector('#image-viewer-close');
        
        // Add to DOM
        document.body.appendChild(this.overlay);
        
        // Set up event handlers
        this.bindEvents();
    };
    
    // Bind all event handlers
    ImageViewer.prototype.bindEvents = function() {
        var self = this;
        
        // Click on overlay background to close
        this.overlay.addEventListener('click', function(e) {
            if (e.target === self.overlay) {
                self.hide();
            }
        });
        
        // Click on close button to close
        this.closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            self.hide();
        });
        
        // Prevent clicks on image from closing the viewer
        this.imageContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    };
    
    // Handle keydown events (for ESC key)
    ImageViewer.prototype.handleKeydown = function(e) {
        if (e.key === 'Escape' && this.isVisible) {
            this.hide();
        }
    };
    
    // Show an image in the viewer
    ImageViewer.prototype.show = function(imgSrc, imgAlt) {
        // Set image source and alt text
        this.image.src = imgSrc || '';
        this.image.alt = imgAlt || '';
        
        // Show the overlay
        this.overlay.style.display = 'flex';
        
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
        
        // Add ESC key handler
        document.addEventListener('keydown', this.boundKeydownHandler);
        
        // Update state
        this.isVisible = true;
        
        console.log('Image viewer opened:', imgSrc);
    };
    
    // Hide the viewer
    ImageViewer.prototype.hide = function() {
        // Hide the overlay
        this.overlay.style.display = 'none';
        
        // Allow scrolling again
        document.body.style.overflow = '';
        
        // Remove ESC key handler
        document.removeEventListener('keydown', this.boundKeydownHandler);
        
        // Update state
        this.isVisible = false;
        
        console.log('Image viewer closed');
    };
    
    // Clean up the viewer instance
    ImageViewer.prototype.destroy = function() {
        // Remove overlay from DOM
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        
        // Remove ESC key handler
        document.removeEventListener('keydown', this.boundKeydownHandler);
        
        // Clear references
        this.overlay = null;
        this.closeButton = null;
        this.imageContainer = null;
        this.image = null;
    };
    
    return ImageViewer;
})();

// Global viewer instance
var globalViewer = null;

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Initializing ImageViewer...');
        
        // Clean up old instance if it exists
        if (globalViewer) {
            globalViewer.destroy();
        }
        
        // Create new instance
        globalViewer = new ImageViewer();
        
        // Find all zoomable images
        var imageSelectors = [
            'img[data-zoomable]',
            '.case-image img',
            '.product-image img', 
            '.gallery-image img',
            '.case-gallery img', 
            '.product-gallery img',
            '.case-details img'
        ].join(',');
        
        var images = document.querySelectorAll(imageSelectors);
        console.log('Found ' + images.length + ' zoomable images');
        
        // Add click handlers to all images
        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            
            // Skip images in sliders
            if (img.closest('.swiper-slide') || img.closest('.swiper-wrapper')) {
                continue;
            }
            
            // Make the image look clickable
            img.style.cursor = 'zoom-in';
            
            // Mark as zoomable
            img.setAttribute('data-zoomable', 'true');
            
            // Store a reference to any existing handler
            var oldHandler = img._imageViewerClickHandler;
            
            // Remove old handler if it exists
            if (oldHandler) {
                img.removeEventListener('click', oldHandler);
            }
            
            // Create and store new handler
            img._imageViewerClickHandler = (function(img) {
                return function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (globalViewer) {
                        globalViewer.show(img.src, img.alt);
                    }
                };
            })(img);
            
            // Add the click event
            img.addEventListener('click', img._imageViewerClickHandler);
        }
        
        console.log('ImageViewer initialization complete');
        
        // Debug helper
        window.debugImageViewer = function() {
            console.log('Image Viewer Debug:');
            console.log('- Global viewer:', globalViewer);
            console.log('- Is visible:', globalViewer.isVisible);
            console.log('- Overlay display:', globalViewer.overlay.style.display);
            console.log('- Image src:', globalViewer.image.src);
            
            return 'Debug info logged to console';
        };
        
    } catch (error) {
        console.error('Error initializing ImageViewer:', error);
    }
});
