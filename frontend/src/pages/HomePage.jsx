import React from 'react'
import NavBar from '../components/Navbar'
import Hero from '../components/Hero'
//import LatestProductsRow from '../components/LatestProductsRow'
import LatestProducts from '../components/LatestProducts'
import BottomNavbar from '../components/BottomNavbar'
import CategoryToolbar from '../components/Toolbar'
const HomePage = () => {
  return (
    <div>
        <NavBar/>
        <CategoryToolbar/>
        <Hero/>
        <LatestProducts/>
        <BottomNavbar/>
    </div>
  )
}

export default HomePage