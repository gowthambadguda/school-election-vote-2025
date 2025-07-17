document.addEventListener('DOMContentLoaded', () => {
    const positions = document.querySelectorAll('.position');
    const submitButton = document.getElementById('submit-vote');
    const voteDialog = document.getElementById('vote-dialog');
    let selections = {};

    positions.forEach(position => {
        position.querySelectorAll('.candidate').forEach(candidate => {
            candidate.addEventListener('click', () => {
                const positionId = position.id;
                const selectedCandidateName = candidate.dataset.candidate;

                // Deselect previous choice in the same position
                const currentSelection = position.querySelector('.candidate.selected');
                if (currentSelection) {
                    currentSelection.classList.remove('selected');
                }

                // Select new choice and record it
                candidate.classList.add('selected');
                selections[positionId] = selectedCandidateName;
            });
        });
    });

    submitButton.addEventListener('click', () => {
        if (Object.keys(selections).length === 0) {
            alert("Please select at least one candidate before submitting.");
            return;
        }

        // Retrieve existing votes from localStorage or initialize
        let votes = JSON.parse(localStorage.getItem('electionVotes')) || {};

        // Update vote counts with the new selections
        for (const positionId in selections) {
            const candidate = selections[positionId];
            if (!votes[candidate]) {
                votes[candidate] = 0;
            }
            votes[candidate]++;
        }

        // Save the updated vote counts back to localStorage
        localStorage.setItem('electionVotes', JSON.stringify(votes));

        // --- New Dialog Box Logic ---
        
        // 1. Show the dialog box
        voteDialog.classList.add('visible');

        // 2. Clear all visual selections from the page
        document.querySelectorAll('.candidate.selected').forEach(selectedCandidate => {
            selectedCandidate.classList.remove('selected');
        });

        // 3. Reset the internal selections object for the next voter
        selections = {};

        // 4. Set a timer to hide the dialog box after 2 seconds
        setTimeout(() => {
            voteDialog.classList.remove('visible');
        }, 2000); // 2000 milliseconds = 2 seconds
    });
});