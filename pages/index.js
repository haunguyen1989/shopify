import {EmptyState, Layout, Page} from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
    state = {open: false};

    render() {
        const emptyState = !store.get('ids');
        return (
            <Page>
                <Layout>
                    <EmptyState
                        heading="Discount your products temporarily"
                        action={{
                            content: 'Select products',
                            onAction: () => this.setState({ open: true }),
                        }}
                        image={img}
                    >
                        <p>Select products to change their price temporarily up.</p>
                    </EmptyState>
                </Layout>}
            </Page>
        );
    }
}

export default Index;