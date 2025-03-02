import express from 'express';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const app = express();
app.use(express.json());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '' ;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

app.post('/create_customer', async (req, res) => {
    const { email, names, phone_number, dealership_id } = req.body;

    if (!email || !names || !phone_number || !dealership_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const supabase = createClientComponentClient()


            const {  data: clientData, error: clientError } = await supabase
        .from("client")
        .select("*")
        .match({ email: email, phone_number: phone_number });

        if(clientError || clientData.length > 0){
            return Response.json({ message: 'Client already exists' }, { status: 400 });
            res.status(201).json({ message: 'Client already exists' });
        }else {

            const { data, error } = await supabase
            .from('customers')
            .insert([
                { email, names, phone_number, dealership_id }
            ]);

        if (error) {
            throw error;
        }

        res.status(201).json(data);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});