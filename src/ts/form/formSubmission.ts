export default function formSubmission(): void {
    const form: HTMLFormElement = document.getElementById('form') as HTMLFormElement;
    const result: HTMLElement | null = document.getElementById('result');

    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        if (result) result.innerHTML = "Please wait..."

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    if (result) result.innerHTML = json.message;
                } else {
                    if (result) result.innerHTML = json.message;
                }
            })
            .catch(_error => {
                if (result) result.innerHTML = `Something went wrong! Please try again or email me directly at <a href="mailto:robin.code22@gmail.com">robin.code22@gmail.com</a>`;
            })
            .then(function() {
                form.reset();
                setTimeout(() => {
                    if (result) result.style.display = "none";
                }, 3000);
            });
    });
}