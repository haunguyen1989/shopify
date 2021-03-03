import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithOrders from '../components/ResourceOrders';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Orders extends React.Component {
  render() {
    return (
      <Page>
          <ResourceListWithOrders />
      </Page>
    );
  }


}

export default Orders;
