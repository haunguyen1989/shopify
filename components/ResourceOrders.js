import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const GET_ORDERS = gql`
  query OrderUnfulfilled {
    orders(first: 50, sortKey:CREATED_AT, reverse: true, after: null) {
  edges {
   cursor
    node {
      id
      createdAt
      name
      displayFulfillmentStatus
      fulfillments {
        status
      }
     
      fulfillmentOrders(first: 1) {
        edges {
          node {
            id
            supportedActions {
              action
              externalUrl
            }
            lineItems(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
 }
}
`;

class ResourceListWithOrders extends React.Component {

  render() {
    return (
        <Query query={GET_ORDERS} variables={{ }}>
          {({ data, loading, error }) => {
            if (loading) { return <div>Loading…</div>; }
            if (error) { return <div>{error.message}</div>; }
            console.log(data);
            return (
                <div>Den day</div>
            );
          }}
        </Query>
    );
  }
}

export default ResourceListWithOrders;
