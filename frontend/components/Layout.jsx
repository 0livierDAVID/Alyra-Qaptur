import Header from "./Header";
import Footer from "./Footer";
import { Container } from "@mui/system";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <Container>
                {children}
            </Container>
            <Footer />
        </>
    );
};

export default Layout;