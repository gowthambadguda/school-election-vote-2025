document.addEventListener('DOMContentLoaded', () => {
    const votes = JSON.parse(localStorage.getItem('electionVotes')) || {};
    const totalVotesByPosition = {};
    const candidateResults = document.querySelectorAll('.candidate-result');
    const resetButton = document.getElementById('reset-votes');

    // Function to calculate and display results
    function displayResults() {
        // Clear previous totals to recalculate
        for (const key in totalVotesByPosition) {
            delete totalVotesByPosition[key];
        }

        // First, calculate the total votes cast for each position
        candidateResults.forEach(candidateDiv => {
            const positionDiv = candidateDiv.closest('.position, .position-group');
            const positionId = positionDiv.id;
            const candidateName = candidateDiv.dataset.candidate;
            const voteCount = votes[candidateName] || 0;

            if (!totalVotesByPosition[positionId]) {
                totalVotesByPosition[positionId] = 0;
            }
            totalVotesByPosition[positionId] += voteCount;
        });

        // Now, update the UI for each candidate with vote counts and percentages
        candidateResults.forEach(candidateDiv => {
            const positionDiv = candidateDiv.closest('.position, .position-group');
            const positionId = positionDiv.id;
            const candidateName = candidateDiv.dataset.candidate;
            const voteCount = votes[candidateName] || 0;
            const totalPositionVotes = totalVotesByPosition[positionId];

            // Update vote count text
            const voteCountSpan = candidateDiv.querySelector('.vote-count');
            voteCountSpan.textContent = `${voteCount} vote${voteCount !== 1 ? 's' : ''}`;

            // Update progress bar width based on percentage
            const voteBar = candidateDiv.querySelector('.vote-bar');
            const percentage = totalPositionVotes > 0 ? (voteCount / totalPositionVotes) * 100 : 0;
            voteBar.style.width = `${percentage}%`;
        });
    }

    // Add event listener for the reset button
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Confirm the action with the user
            const isConfirmed = confirm("Are you sure you want to reset all votes? This action is permanent and cannot be undone.");
            
            if (isConfirmed) {
                // Remove the votes from storage
                localStorage.removeItem('electionVotes');

                // Alert the user and reload the page to reflect the changes
                alert("All votes have been successfully reset.");
                location.reload();
            }
        });
    }

    // Initial display of results when the page loads
    displayResults();
});