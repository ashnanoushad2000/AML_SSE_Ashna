from flask import request, abort

# List of allowed IPs (e.g., internal library IPs)
ALLOWED_ADMIN_IPS = ['127.0.0.1', '192.168.1.100', '10.67.198.10']  # Add your library IPs here

def ip_filter():
    ip = request.remote_addr
    if ip not in ALLOWED_ADMIN_IPS:
        abort(403, description="Access forbidden: Untrusted IP address")
