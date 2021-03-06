module.exports = {
    updatePreferred: async(req,res) => {
        const db = req.app.get('db')
        const {id} = req.session.user
        const {newPref} = req.body

        const updatedPreferred = await db.airports.updatePreferredAirport([id, newPref])

        res.status(200).send(updatedPreferred)
    },
    getPreferred: async(req,res) => {
        const db = req.app.get('db')
        const {id} = req.session.user
        
        const grabPreferred = await db.airports.getPreferredAirport(id)
        
        
        res.status(200).send(grabPreferred)
    }
}