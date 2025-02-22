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
        if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
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


//contact page functionality
// Function to display the email

function displayEmail() {
    var part1 = "raindust";
    var part2 = "@myyahoo.com";
    var email = part1 + part2;

    // Find the div by its ID and insert the email link
    document.getElementById("email").innerHTML = '<a href="mailto:' + email + '">' + email + '</a>';
}

// Function to display the X profile link
function displayXLink() {
    var xProfileUrl = "https://x.com/az_rain_dust"; // Replace 'yourprofile' with your actual profile name
    
    // Find the div by its ID and insert the X profile link
    document.getElementById("x-link").innerHTML = '<a href="' + xProfileUrl + '" target="_blank">Message me on X (formerly known as twitter)</a>';
}

// Call the functions when the page loads
window.onload = function() {
    displayEmail();
    displayXLink();
};