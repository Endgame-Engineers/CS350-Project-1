const useIsAuthenticated = async () => {
    // try {
    //     const response = await fetch('https://3000--main--cs350--sirbomble.coder.galifrey.dev/api/auth/google/success', {
    //         method: 'GET',
    //         credentials: 'include',
    //     });

    //     if (response.ok) {
    //         const data = await response.json();
    //         return await data.isAuthenticated;

    //     } else {
    //         console.error('Error checking authentication:', response.statusText);
    //         return false;
    //     }
    // } catch (error) {
    //     console.error('Error checking authentication:', error);
    //     return false;
    // }
    return true;
};

export default useIsAuthenticated;