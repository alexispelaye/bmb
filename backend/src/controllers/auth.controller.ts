export const login = (req, res) => {
    const { user, password } = req.body;
    if (!user === 'admin' && comparePassword(password, 'admin')) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }
    const token = signToken({ user });
    return res.send({ token });
}

export const me = (req, res) => {
    return res.send(req.user);
}

export const register = (req, res) => {
    return res.send('Ups! This is not implemented yet');
}