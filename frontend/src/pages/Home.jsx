    import { useEffect } from "react";

    function Home() {
        const [users, setUsers] = useState([]);

        useEffect(() => {
        const fetchUsers = async () => {
            try {
            const response = await userService.getAll();
            setUsers(response.data);
            } catch (error) {
            console.log(error);
            }
        };

        fetchUsers();
        }, []);
    return (
        <div>
        
        </div>
    );
    }

    export default Home;
