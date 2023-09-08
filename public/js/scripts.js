document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.vote-button').forEach(button => {
        button.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie-id');
            const isUpvote = this.classList.contains('upvote');

            // Call your backend API to register the vote
            fetch(`/vote?movieId=${movieId}&upvote=${isUpvote}`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update the vote count in the UI
                        const voteCountEl = this.parentElement.querySelector('.vote-count');
                        voteCountEl.textContent = data.newVoteCount;
                    } else {
                        console.error("Error voting:", data.message);
                    }
                });
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
  const voteButtons = document.querySelectorAll('.vote-btn');

  voteButtons.forEach(btn => {
    btn.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default form submission

      const movieId = this.getAttribute('data-id');
      const voteType = this.getAttribute('data-vote');
      const voteSpan = this.closest('.vote-container').querySelector('.vote-count');

      // AJAX call using Fetch API
      fetch('/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: movieId,
          action: voteType
        })
      })
      .then(response => response.json())
      .then(data => {
        // Update the vote count on the page
        if(data && data.newVoteCount !== undefined) {
          voteSpan.textContent = data.newVoteCount;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  });
});

