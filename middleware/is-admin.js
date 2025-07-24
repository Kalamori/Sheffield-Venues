export default function isAdmin(req, res, next) {
    if (!req.session?.user?.is_admin) {
        return res.status(403).send("Access Denied. Admins Only.")
    }
    next()
}