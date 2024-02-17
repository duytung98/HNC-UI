import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { public_routers, private_routers } from '~/routers';
import { GlobalStyle } from '~/components/';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle>
        <div className="App">
          <Routes>
            {/* Định nghĩa các router công khai của trang */}
            {public_routers.length > 0 && public_routers.map((route, index) => {
              let Layout = 'div';
              if (route.layout) Layout = route.layout;
              return (
                <Route path={route.path} key={index}
                  element={<Layout>{route.element}</Layout>}
                />
              )
            })}
            {/* Định nghĩa các router riêng tư của trang */}
            {private_routers.length > 0 && private_routers.map((route, index) => {
              let Layout = 'div';
              if (route.layout) Layout = route.layout;
              return (
                <Route path={route.path} key={index}
                  element={<Layout>{route.element}</Layout>}
                />
              )
            })}
          </Routes>
        </div>
      </GlobalStyle>
    </BrowserRouter>
  )
};

export default App;