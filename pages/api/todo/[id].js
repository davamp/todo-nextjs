import {supabase} from "../../../utils/supabase";

export default async function handler(req, res) {
    if (req.method === 'PATCH') await updateData(req, res);
    if (req.method === 'DELETE') await deleteData(req, res);
}

async function updateData(req, res) {
    const {todo, isCompleted} = JSON.parse(req.body);
    const id = req.query.id;
    // if (!todo && todo == null) return res.status(400).json({message: "bad request !!"})
    const {data: existed} = await supabase.from("todo").select().eq("todo", todo)
    if (existed.length > 0) return res.status(409).json({message: "todo is already existed !!"})
    let update = {};
    if (todo) {
        update = {
            todo: todo
        }
    }
    if (isCompleted != null) {
        update = {
            ...update,
            isCompleted: true
        }
    }
    await supabase.from('todo')
        .update(update).eq("id", id);
    return res.status(200).json({});
}

async function deleteData(req, res) {
    const id = req.query.id;
    await supabase.from('todo').delete().eq("id", id);
    return res.status(200).json({});
}
