import React from 'react'

import { Switch, Route } from 'react-router-dom'

import Layout from '../components/Layout'
import Dashboard from '../pages/Dashboard'
import Lists from '../pages/Lists'

const AppRoutes: React.FC = () => (
  <Layout>
    <Switch>
      <Route path='/' exact component={Dashboard} />
      <Route path='/lists/:type' exact component={Lists} />
    </Switch>
  </Layout>
)

export default AppRoutes