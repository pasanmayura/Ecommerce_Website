export const getOrders = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/order/getOrders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            },
        });
        if (!response.ok) {
            const responseText = await response.text();
            console.log('Response text:', responseText);
            throw new Error(responseText);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { message: 'There was an error getting the order details. Please try again.' };
    }
}

export const viewOrderbyId = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/api/order/viewOrderbyId/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            },
        });
        if (!response.ok) {
            const responseText = await response.text();
            console.log('Response text:', responseText);
            throw new Error(responseText);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { message: 'There was an error getting the order details. Please try again.' };
    }
}