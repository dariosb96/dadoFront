import { useState } from 'react'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import CatalogPage from './Views/CatalogPage'
import Create_user from './Views/createUser'
import Login from './Views/LoginPage'
import Create_Product from './Views/createProduct'
import Protected_Route from './components/Protected_Route'
import Home from './Views/home';
import MyCatalogLink from './components/MyCatalogLink'
import Create_Sell from './Views/createSell'
import DashboardSPA from './Views/dashSPA'
import View_Sells from './Views/SellsView'
import AllProductsPage from './Views/productsGeneral'
import CatalogList from './Views/CatalogList'
import UpdateUser from './Views/updateUser'
import UserProfile from './Views/profile'

function App() {
 DashboardSPA
  return (
    <>
    <Routes>
      <Route path="/create" element={<Create_user/>} />
      
      <Route path="/" element={<Login/>} />
      <Route path="/catalog/:userId" element={<CatalogPage/>} />
      <Route path='/allcatalogs' element={<CatalogList/>} />
      {/*Rutas Protegidas */}
      <Route element ={<Protected_Route/>}>
      <Route path="/home" element={<Home/>} />
      <Route path="/createProd" element={<Create_Product/>} />
      <Route path="/my-catalog" element={<MyCatalogLink/>}/>
      <Route path="/createSell" element={<Create_Sell/>}/>
      <Route path="/dash" element={<DashboardSPA/>} />
      <Route path="/Sells" element={ <View_Sells/>} />
      <Route path="/products" element={<AllProductsPage/>}/>
      <Route path="/p" element={<UpdateUser/>}/>
      <Route path="profile" element={<UserProfile/>} />
    </Route>
    </Routes>
    </>
  )
}

export default App
