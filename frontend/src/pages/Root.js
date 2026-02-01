import { Outlet, useLoaderData, useSubmit} from 'react-router-dom';

import MainNavigation from '../components/MainNavigation';
import { useEffect } from 'react';
import { getTokenDuration } from '../util/Auth';

function RootLayout() {
  const submit = useSubmit();
  // const navigation = useNavigation();
  const token = useLoaderData();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action : '/logout', method: 'post'})
    }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration)


    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post'})
    }, tokenDuration);
  }, [submit, token])
  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
