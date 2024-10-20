import bcrypt
import mysql.connector
from mysql.connector import Error

def hash_password(password):
    # Genera un salt y hashea la contraseña
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

def update_support_passwords():
    try:
        # Conectar a la base de datos
        connection = mysql.connector.connect(
            host='localhost',  # Cambia esto si tu base de datos no está en localhost
            database='aula',  # Cambia esto al nombre de tu base datos
            user='root',  # Cambia esto a tu usuario de la base de datos
            password=''  # Cambia esto a tu contraseña de la base de datos
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id_support, clave FROM SUPPORT")
            supports = cursor.fetchall()

            for support in supports:
                hashed_password = hash_password(support['clave'])
                cursor.execute(
                    "UPDATE SUPPORT SET clave = %s WHERE id_support = %s",
                    (hashed_password, support['id_support'])
                )
                connection.commit()
                print(f"Contraseña actualizada para el usuario {support['id_support']}")

    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Conexión a la base de datos cerrada")

if __name__ == "__main__":
    update_support_passwords()