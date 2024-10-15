//functionality for the table of contents
document.addEventListener("DOMContentLoaded", function() {
    const tocList = document.getElementById("toc-list");
    const headings = document.querySelectorAll('.section-title, .subsection-title');

    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = heading.textContent;
        link.href = `#${heading.textContent.replace(/\s+/g, '-').toLowerCase()}`;

        // Add the heading text to the TOC with modified href
        heading.setAttribute('id', heading.textContent.replace(/\s+/g, '-').toLowerCase());
        link.addEventListener('click', function() {
            heading.scrollIntoView({ behavior: 'smooth' });
        });

        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
});

//this function checks that the DOM is fully loaded before getting the element for the back to top button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTopBtn');

    // Show the button when scrolled down 200px
    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    // Scroll to the top when the button is clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll effect
        });
    });
});

