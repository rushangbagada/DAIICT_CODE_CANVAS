
import { Outlet } from 'react-router-dom'
import EnhancedNavbar from '../components/EnhancedNavbar'
import EnhancedFooter from '../components/EnhancedFooter'

export default function Layout() {
    return (
        <>
            <EnhancedNavbar/>
            <Outlet />
            <EnhancedFooter />
        </>
    )
}
