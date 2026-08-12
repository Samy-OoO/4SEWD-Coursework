import { Link } from 'react-router-dom';

// One consistent button used everywhere, so sizing/padding/radius never drift
// page to page. `to` renders a router Link styled like a button.
export default function Button({ variant = 'primary', to, type = 'button', className = '', children, ...rest }) {
    const classes = `btn btn-${variant} ${className}`.trim();

    if (to) {
        return (
            <Link to={to} className={classes} {...rest}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} {...rest}>
            {children}
        </button>
    );
}
