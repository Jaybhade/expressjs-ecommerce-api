import Stripe from 'stripe'

export const stripe = new Stripe(
  'sk_test_51IaCdtSAFLVuLVf6QHnVjsM1k9lQw8cKPhAvGGbu44WvIUsexs9YWV2CldwrpcxxXNjrGNg1ajjUpxMXpgvwyXCf00XXGVRYkB',
  {
    apiVersion: '2020-08-27',
  },
)
