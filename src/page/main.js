import React from 'react';
import { Layout, Menu, Icon, Button, Tabs } from 'antd';
import SrmTable from '../components/table';


const { Header, Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

class Main extends React.Component {
  
  render () {
    return (
      <Layout>
        <Header
          className="header"
          style={{ height: '50px' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '50px' }}
          >
            <Menu.Item key="1">首页</Menu.Item>
            <Menu.Item key="2">我的招标书维护</Menu.Item>
          </Menu>
        </Header>

        <Layout>
          <Content style={{ background: '#FFFFFF', padding: 24, margin: 0, minHeight: 300, textAlign: 'left' }}>
          <Tabs defaultActiveKey="2">
            <TabPane tab="待招标申请" key="1">待招标申请</TabPane>
            <TabPane tab="进行中的招标书" key="2">
              <SrmTable />
            </TabPane>
          </Tabs>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Main;
