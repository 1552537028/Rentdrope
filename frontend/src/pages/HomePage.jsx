import React from 'react'
import NavBar from '../components/Navbar'
import Hero from '../components/Hero'
import LatestProductsRow from '../components/LatestProductsRow'
import LatestProducts from '../components/LatestProducts'
import BottomNavbar from '../components/BottomNavbar'
const HomePage = () => {
  return (
    <div>
        <NavBar/>
        <br/>
        <Hero/>
        <LatestProductsRow/>
        <LatestProducts/>
        <BottomNavbar/>
    </div>
  )
}

export default HomePage