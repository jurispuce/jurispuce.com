// Blog search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('blog-search-input');
    const searchForm = document.getElementById('blog-search-form');
    const featuredPosts = document.querySelectorAll('.featured-card');
    const regularPosts = document.querySelectorAll('.post-card');
    const noResultsMessage = document.getElementById('no-results-message');
    
    if (searchForm && searchInput) {
        // Prevent form submission (we'll handle filtering via JS)
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch();
        });
        
        // Search as you type (with debounce)
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(performSearch, 300);
        });
        
        // Clear search button
        const clearSearchBtn = document.getElementById('clear-search-btn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                performSearch();
                clearSearchBtn.classList.add('hidden');
            });
        }
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            let featuredMatchCount = 0;
            let regularMatchCount = 0;
            
            // Show/hide clear button
            if (clearSearchBtn) {
                if (searchTerm.length > 0) {
                    clearSearchBtn.classList.remove('hidden');
                } else {
                    clearSearchBtn.classList.add('hidden');
                }
            }
            
            // Filter featured posts
            featuredPosts.forEach(post => {
                const title = post.querySelector('h3 a').textContent.toLowerCase();
                const description = post.querySelector('p').textContent.toLowerCase();
                const categories = Array.from(post.querySelectorAll('.category-tag')).map(tag => tag.textContent.toLowerCase());
                
                if (searchTerm === '' || 
                    title.includes(searchTerm) || 
                    description.includes(searchTerm) ||
                    categories.some(cat => cat.includes(searchTerm))) {
                    post.style.display = '';
                    featuredMatchCount++;
                } else {
                    post.style.display = 'none';
                }
            });
            
            // Filter regular posts
            regularPosts.forEach(post => {
                const title = post.querySelector('h3 a').textContent.toLowerCase();
                const description = post.querySelector('p').textContent.toLowerCase();
                const categories = Array.from(post.querySelectorAll('.category-tag')).map(tag => tag.textContent.toLowerCase());
                
                if (searchTerm === '' || 
                    title.includes(searchTerm) || 
                    description.includes(searchTerm) ||
                    categories.some(cat => cat.includes(searchTerm))) {
                    post.style.display = '';
                    regularMatchCount++;
                } else {
                    post.style.display = 'none';
                }
            });
            
            // Show/hide sections based on results
            const featuredSection = document.querySelector('.featured-events');
            const allPostsSection = document.querySelector('.all-posts');
            
            if (featuredSection) {
                featuredSection.style.display = featuredMatchCount > 0 ? '' : 'none';
            }
            
            if (allPostsSection) {
                allPostsSection.style.display = regularMatchCount > 0 ? '' : 'none';
            }
            
            // Show/hide no results message
            if (noResultsMessage) {
                if (featuredMatchCount === 0 && regularMatchCount === 0 && searchTerm !== '') {
                    noResultsMessage.style.display = 'block';
                } else {
                    noResultsMessage.style.display = 'none';
                }
            }
        }
    }
});
