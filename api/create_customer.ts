import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';



export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, names, phone_number, dealership_id } = req.body;

  if (!email || !names || !phone_number || !dealership_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  let log = 'Pre Try';

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    log = 'supabase client created'

    // Verificar si el cliente ya existe
    const { data: clientData, error: clientError } = await supabase
      .from('client')
      .select('*')
      .match({ email: email, phone_number: phone_number });

    log = 'search clients'
    if (clientError || clientData.length > 0) {
      return res.status(400).json({ message: 'Client already exists' });
    }


    log = 'clientData: ' + JSON.stringify(clientData);
    // Insertar nuevo cliente
    const { data, error } = await supabase
      .from('client')
      .insert([
        { email, names, phone_number, dealership_id }
      ]);
    
    log = 'supabase insert'

    if (error) {
        log = 'error: ' + JSON.stringify(error);
      throw error;
    }

    return res.status(201).json(data);

  } catch (error: any) {
    return res.status(500).json({message:log});
  }
}
