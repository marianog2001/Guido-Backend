// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.

const stripe = Stripe('pk_test_51Ow8pIRwV5TrntSwZriQGFmoa2gO4I8Vp1Z6qfo3UmF1vTwTxRDXsU7gBQJea5tuzT1gD0n0j9D7qFyOq2aHUQRA009DSzDfpV')

// The items the customer wants to buy

let elements


document
    .querySelector('#payment-form')
    .addEventListener('submit', handleSubmit)

// Fetches a payment intent and captures the client secret
async function initialize(items) {
    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
    })
    const { clientSecret } = await response.json()

    const appearance = {
        theme: 'stripe',
    }
    var elements = stripe.elements({ appearance, clientSecret })
    console.log(elements)
    const paymentElementOptions = {
        layout: 'tabs',
    }

    const paymentElement = elements.create('payment', paymentElementOptions)
    paymentElement.mount('#payment-element')
}

async function handleSubmit(e) {
    e.preventDefault()
    console.log(elements)
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: 'http://localhost:4242/checkout.html',
        },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
        showMessage(error.message)
    } else {
        showMessage('An unexpected error occurred.')
    }

}

// Fetches the payment intent status after payment submission
async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
    )

    if (!clientSecret) {
        return
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

    switch (paymentIntent.status) {
    case 'succeeded':
        showMessage('Payment succeeded!')
        break
    case 'processing':
        showMessage('Your payment is processing.')
        break
    case 'requires_payment_method':
        showMessage('Your payment was not successful, please try again.')
        break
    default:
        showMessage('Something went wrong.')
        break
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector('#payment-message')
  
    messageContainer.classList.remove('hidden')
    messageContainer.textContent = messageText
  
    setTimeout(function () {
        messageContainer.classList.add('hidden')
        messageContainer.textContent = ''
    }, 4000)
}