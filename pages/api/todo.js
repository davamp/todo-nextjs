import {supabase} from "../../utils/supabase";

export default async function handler(req, res) {
    if (req.method === 'GET') await fetchData(req, res);
    if (req.method === 'POST') await insertData(req, res);
}

async function insertData(req, res) {
    const {todo, isCompleted} = JSON.parse(req.body);
    if (!todo) return res.status(400).json({message: "bad request !!"})
    const {data: existed} = await supabase.from("todo").select().eq("todo", todo)
    if (existed.length > 0) return res.status(409).json({message: "todo is already existed !!"})
    const {data: inserted} = await supabase.from('todo')
        .upsert({todo: todo, isCompleted: isCompleted}).select();
    return res.status(200).json(inserted[0]);
}

async function fetchData(req, res) {
    const {data} = await supabase.from('todo').select()
    return res.status(200).json(data);
}
