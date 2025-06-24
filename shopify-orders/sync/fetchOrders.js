const query = `
query getOrders($cursor: String) {
  orders(first: 10, after: $cursor) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        createdAt
        totalPrice
        customer {
          id
          email
          firstName
          lastName
        }
        lineItems(first: 10) {
          edges {
            node {
              id
              title
              quantity
              originalUnitPrice {
                amount
              }
            }
          }
        }
      }
    }
  }
}
`;
